import React from 'react';

interface Props {
  score: number;
}

export const VitalityVisualizer: React.FC<Props> = ({ score }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl mb-6 shadow-2xl">
      <style>{`
        .fitos-bio {
          background: #02040a;
          color: #e0faff;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          height: 400px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 1.5rem;
          border: 1px solid #27272a;
        }
        .glow-orb {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(163, 230, 53, 0.25) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%;
          filter: blur(40px);
          animation: pulse 8s infinite alternate;
          z-index: 1;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0.7; }
        }
        .membrane-ui {
          z-index: 2;
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 40px;
          width: 85%;
          text-align: center;
          box-shadow: 0 0 40px rgba(163, 230, 53, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fluid-stat {
          font-size: 4rem;
          font-weight: 200;
          letter-spacing: -3px;
          background: linear-gradient(to bottom, #fff, #a3e635);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 10px 0;
          line-height: 1;
        }
        .sub-label {
          color: rgba(163, 230, 53, 0.8);
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .heart-pulse {
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.1);
          margin: 24px 0;
          position: relative;
          overflow: hidden;
        }
        .heart-pulse::after {
          content: '';
          position: absolute;
          left: -100px;
          width: 100px;
          height: 100%;
          background: linear-gradient(90deg, transparent, #a3e635, transparent);
          animation: sweep 2s infinite linear;
        }
        @keyframes sweep {
          0% { left: -100px; }
          100% { left: 100%; }
        }
      `}</style>
      <div className='fitos-bio'>
        <div className='glow-orb'></div>
        <div className='membrane-ui'>
          <div className='sub-label'>Vitality Index</div>
          <div className='fluid-stat'>{score.toFixed(1)}</div>
          <div className='heart-pulse'></div>
          <div className='sub-label'>System Synced</div>
        </div>
      </div>
    </div>
  );
};