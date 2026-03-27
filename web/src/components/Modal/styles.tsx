import styled, { keyframes } from 'styled-components';
import { vp } from '../../styles/scale';

const modalFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const cardPopIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(${vp(8)}) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  background: rgba(6, 10, 18, 0.42);
  z-index: 1000;
  font-family: 'Nexa-Book', sans-serif;
  animation: ${modalFadeIn} 180ms ease-out;
`;

export const Card = styled.div`
  width: min(${vp(420)}, calc(100vw - ${vp(40)}));
  border-radius: ${vp(16)};
  padding: ${vp(26)} ${vp(24)} ${vp(20)};
  background:
    linear-gradient(145deg, rgba(255, 166, 113, 0.2), rgba(255, 122, 182, 0.2) 50%, rgba(120, 144, 255, 0.14) 100%),
    rgba(24, 31, 46, 0.78);
  border: 1px solid rgba(255, 223, 232, 0.62);
  box-shadow:
    0 ${vp(14)} ${vp(40)} rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-align: left;
  animation: ${cardPopIn} 220ms ease-out;

  h2 {
    font-size: ${vp(34)};
    line-height: 1;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 ${vp(10)} 0;
    font-family: 'Nexa-Book', sans-serif;
  }

  p {
    font-size: ${vp(15)};
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 ${vp(24)} 0;
    font-family: 'Nexa-Book', sans-serif;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: ${vp(10)};

  button {
    flex: 1;
    min-width: ${vp(90)};
    height: ${vp(36)};
    border-radius: ${vp(8)};
    font-size: ${vp(12)};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Nexa-Book', sans-serif;

    &:last-child {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.34);
      color: #ffffff;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.52);
        color: #ffffff;
      }
    }
    
    &:first-child {
      background: linear-gradient(140deg, rgba(255, 188, 72, 0.95), rgba(255, 118, 198, 0.9));
      border: 1px solid rgba(255, 233, 169, 0.72);
      color: rgba(42, 22, 74, 0.98);
      
      &:hover {
        filter: brightness(1.06);
      }
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
`;
