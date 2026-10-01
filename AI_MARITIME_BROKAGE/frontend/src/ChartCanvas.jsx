import { useRef, useEffect } from 'react';

/**
 * ChartCanvas — Route Comparison Bar Chart
 *
 * Renders a horizontal bar chart on an HTML Canvas element
 * comparing route scores, transit times, and costs.
 */
function ChartCanvas({ routes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!routes || routes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const width = canvas.parentElement.offsetWidth;
    const height = Math.max(280, routes.length * 80 + 100);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart config
    const padding = { top: 50, right: 30, bottom: 40, left: 160 };
    const chartWidth = width - padding.left - padding.right;
    const barHeight = 28;
    const barGap = 44;
    const maxScore = Math.max(...routes.map(r => r.score), 1);

    // Title
    ctx.font = '600 14px Outfit, sans-serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'left';
    ctx.fillText('Route Score Comparison', padding.left, 28);

    ctx.font = '400 11px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('(Lower score = better route)', padding.left + 210, 28);

    // Draw bars
    routes.forEach((route, index) => {
      const y = padding.top + index * barGap;
      const barWidth = (route.score / maxScore) * chartWidth;

      // Route name label
      ctx.font = '500 12px Inter, sans-serif';
      ctx.fillStyle = route.is_best ? '#10b981' : '#94a3b8';
      ctx.textAlign = 'right';
      ctx.fillText(route.route_name, padding.left - 12, y + barHeight / 2 + 4);

      // Bar background
      ctx.fillStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.beginPath();
      roundRect(ctx, padding.left, y, chartWidth, barHeight, 6);
      ctx.fill();

      // Bar fill with gradient
      const gradient = ctx.createLinearGradient(padding.left, y, padding.left + barWidth, y);
      if (route.is_best) {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#06b6d4');
      } else {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      roundRect(ctx, padding.left, y, Math.max(barWidth, 4), barHeight, 6);
      ctx.fill();

      // Glow effect for best route
      if (route.is_best) {
        ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        roundRect(ctx, padding.left, y, Math.max(barWidth, 4), barHeight, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Score label
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${route.score} · ${route.transit_days}d · $${route.cost_per_container || route.total_cost}`,
        padding.left + Math.max(barWidth, 4) + 10,
        y + barHeight / 2 + 4
      );

      // Best route indicator
      if (route.is_best) {
        ctx.font = '600 9px Inter, sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.fillText('★ BEST', padding.left + Math.max(barWidth, 4) + 10, y - 4);
      }
    });

    // Scale markers at bottom
    const numTicks = 5;
    ctx.font = '400 10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';

    for (let i = 0; i <= numTicks; i++) {
      const x = padding.left + (chartWidth / numTicks) * i;
      const val = ((maxScore / numTicks) * i).toFixed(2);
      const bottomY = padding.top + routes.length * barGap + 10;

      // Tick line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padding.top - 5);
      ctx.lineTo(x, bottomY - 15);
      ctx.stroke();

      // Label
      ctx.fillText(val, x, bottomY);
    }

  }, [routes]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        borderRadius: '8px',
      }}
    />
  );
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default ChartCanvas;
