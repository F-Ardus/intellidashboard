import { useLayoutEffect, useState } from 'react';
import type { TourStep } from '../../hooks/useTour';
import { useT } from '../../contexts/LocaleContext';
import { LOCALES } from '../../i18n';
import styles from './TourOverlay.module.scss';

const PAD      = 8;   // px padding around highlighted element
const GAP      = 14;  // px gap between spotlight and tooltip
const TW       = 292; // tooltip width in px
const TH       = 210; // generous estimate of tooltip height in px
const MARGIN   = 12;  // min distance from any viewport edge

interface SpotRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function computeTooltipStyle(rect: SpotRect | null, placement: TourStep['placement']): React.CSSProperties {
  if (placement === 'center' || !rect) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  const { top, left, width, height } = rect;
  const cx  = left + width / 2;
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;

  const clampX = (x: number) => Math.max(MARGIN, Math.min(x, vw - TW - MARGIN));
  const clampY = (y: number) => Math.max(MARGIN, Math.min(y, vh - TH - MARGIN));

  switch (placement) {
    case 'bottom':
      return { top: clampY(top + height + GAP), left: clampX(cx - TW / 2) };

    case 'top':
      return { top: clampY(top - GAP - TH), left: clampX(cx - TW / 2) };

    case 'right':
      return {
        top: clampY(top + height / 2 - TH / 2),
        left: Math.min(left + width + GAP, vw - TW - MARGIN),
      };

    case 'left':
      return {
        top: clampY(top + height / 2 - TH / 2),
        left: Math.max(MARGIN, left - TW - GAP),
      };

    default:
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
}

interface Props {
  steps: TourStep[];
  step: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

/** Returns the best visible element for a step, falling back to `fallbackTarget` when the
 *  primary target has no layout size (e.g. sidebar hidden behind a mobile drawer). */
function resolveElement(target: string, fallback?: string): Element | null {
  const el = document.querySelector(target);
  if (el) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return fallback ? document.querySelector(fallback) : null;
}

export function TourOverlay({ steps, step, total, onNext, onPrev, onSkip }: Props) {
  const { t, locale, setLocale } = useT();
  const current = steps[step] ?? steps[0]!;
  const [rect, setRect] = useState<SpotRect | null>(null);
  const [resolvedPlacement, setResolvedPlacement] = useState<TourStep['placement']>(current.placement ?? 'bottom');
  const [isFallback, setIsFallback] = useState(false);
  const isLast = step === total - 1;

  useLayoutEffect(() => {
    if (!current.target) {
      setRect(null);
      setResolvedPlacement(current.placement ?? 'center');
      setIsFallback(false);
      return;
    }

    const el = resolveElement(current.target, current.fallbackTarget);
    const fb = !!el && el !== document.querySelector(current.target);
    setIsFallback(fb);
    setResolvedPlacement(
      fb && current.fallbackPlacement
        ? current.fallbackPlacement
        : (current.placement ?? 'bottom'),
    );

    if (!el) { setRect(null); return; }

    el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
    const r = el.getBoundingClientRect();
    setRect({
      top:    r.top    - PAD,
      left:   r.left   - PAD,
      width:  r.width  + PAD * 2,
      height: r.height + PAD * 2,
    });
  }, [step, current.target, current.fallbackTarget, current.placement, current.fallbackPlacement]);

  const tourStep = t.tour.steps[step];
  const displayTitle = tourStep?.title ?? current.title;
  const displayDesc = isFallback && tourStep?.fallbackDescription
    ? tourStep.fallbackDescription
    : (tourStep?.description ?? current.description);

  const tooltipStyle = computeTooltipStyle(rect, resolvedPlacement);

  return (
    <>
      {/* Transparent full-screen layer — blocks all page interaction */}
      <div className={styles.blocker} />

      {/* Visual dim: spotlight (hole via box-shadow) or solid overlay for welcome */}
      {rect ? (
        <div
          className={styles.spotlight}
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : (
        <div className={styles.dimOverlay} />
      )}

      {/* Tooltip */}
      <div className={styles.tooltip} style={tooltipStyle}>
        <div className={styles.tooltipTop}>
          <p className={styles.title}>{displayTitle}</p>
          <div className={styles.langDropdown}>
            <select
              className={styles.langSelect}
              value={locale}
              onChange={(e) => setLocale(e.target.value as typeof locale)}
              aria-label="Language"
            >
              {LOCALES.map((l) => (
                <option key={l.id} value={l.id}>{l.flag}</option>
              ))}
            </select>
          </div>
        </div>
        <p className={styles.desc}>{displayDesc}</p>
        <div className={styles.footer}>
          <button className={styles.skipBtn} onClick={onSkip}>{t.tour.skip}</button>
          <div className={styles.actions}>
            <button
              className={styles.chevronBtn}
              onClick={onPrev}
              disabled={step === 0}
              aria-label="Previous step"
            >‹</button>
            <span className={styles.counter}>{step + 1} / {total}</span>
            {isLast ? (
              <button className={styles.nextBtn} onClick={onNext}>{t.tour.finish}</button>
            ) : (
              <button
                className={styles.chevronBtn}
                onClick={onNext}
                aria-label="Next step"
              >›</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
