import styled, { keyframes } from 'styled-components';
import { vp } from '../../styles/scale';

/* Appearance layout styles – now fully driven by the theme palette */

export const Wrapper = styled.div`
  position: relative;
  z-index: 1000;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  overflow: hidden;
  font-family: 'Nexa-Book', sans-serif;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const PANEL_HEIGHT = `calc(100vh - ${vp(24)})`;
const GLASS_BG = `linear-gradient(145deg, rgba(255, 152, 216, 0.24), rgba(139, 119, 255, 0.16) 45%, rgba(72, 207, 255, 0.12) 100%)`;
const GLASS_BORDER = '1px solid rgba(255, 255, 255, 0.54)';
const GLASS_SHADOW = `${vp(6)} ${vp(10)} ${vp(22)} rgba(5, 10, 20, 0.32)`;
const panelSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(${vp(14)}) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

export const MainPanel = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${vp(8)};
  height: ${PANEL_HEIGHT};
  max-height: ${PANEL_HEIGHT};
  margin: ${vp(12)} ${vp(12)} ${vp(12)} 0;
  box-sizing: border-box;
  overflow: hidden;
  animation: ${panelSlideIn} 220ms ease-out;
`;

export const ContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: ${vp(300)};
  min-width: ${vp(300)};
  height: ${PANEL_HEIGHT};
  max-height: ${PANEL_HEIGHT};
  min-height: 0;
  flex-shrink: 0;
  background: ${GLASS_BG};
  border: ${GLASS_BORDER};
  border-radius: ${vp(12)};
  box-shadow: ${GLASS_SHADOW};
  position: relative;
  z-index: 1;
  overflow: hidden;
  isolation: isolate;
  box-sizing: border-box;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    border-radius: 12px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px 128px;
    opacity: 0.11;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: linear-gradient(125deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 24%, rgba(255, 255, 255, 0.02) 52%, rgba(255, 255, 255, 0.14) 100%);
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const Header = styled.div`
  padding: ${vp(16)} ${vp(16)} ${vp(14)};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${vp(12)};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

export const HeaderIcon = styled.div`
  width: ${vp(40)};
  height: ${vp(40)};
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: ${vp(8)};
  
  svg {
    color: ${({ theme }) => `rgb(${theme.accentColor || '77, 171, 247'})`};
    width: ${vp(20)};
    height: ${vp(20)};
  }
`;

export const HeaderText = styled.div`
  flex: 1;
  
  h1 {
    font-size: ${vp(14)};
    font-weight: 600;
    color: ${({ theme }) => `rgb(${theme.fontColor || '193, 194, 197'})`};
    margin: 0 0 ${vp(2)} 0;
  }
  
  p {
    font-size: ${vp(11)};
    color: ${({ theme }) => `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    margin: 0;
  }
`;

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => `rgb(${theme.secondaryBackground || '16, 17, 19'})`};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `rgb(${theme.borderColorSoft || '55, 58, 64'})`};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => `rgb(${theme.accentColor || '77, 171, 247'})`};
  }
`;

export const FooterButtons = styled.div`
  display: flex;
  gap: ${vp(8)};
  padding: ${vp(16)} ${vp(16)} ${vp(20)};
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border-top: 1px solid rgba(255, 255, 255, 0.22);
`;

interface ActionButtonProps {
  variant?: 'primary' | 'secondary';
}

/* Same light blue style as Hat/Torso/Pants - light tint + blue border */
export const ActionButton = styled.button<ActionButtonProps>`
  flex: 1;
  padding: ${vp(8)} ${vp(14)};
  border-radius: ${vp(8)};
  font-size: ${vp(12)};
  font-weight: 600;
  font-family: 'Nexa-Book', sans-serif;
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 180ms ease, filter 180ms ease, background-color 180ms ease, border-color 180ms ease, color 180ms ease;
  
  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: linear-gradient(130deg, rgba(255, 191, 71, 0.94), rgba(255, 112, 194, 0.94));
    border: 1px solid rgba(255, 232, 168, 0.65);
    color: rgba(34, 19, 66, 0.95);
    box-shadow: 0 6px 18px rgba(255, 126, 179, 0.42);
    
    &:hover {
      filter: brightness(1.06);
      box-shadow: 0 8px 20px rgba(255, 132, 186, 0.5);
    }
    
    &:active {
      transform: scale(0.98);
    }
  `
      : `
    background-color: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.34);
    color: rgb(${theme.fontColor || '193, 194, 197'});
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgb(${theme.accentColor || '77, 171, 247'});
      color: rgb(${theme.accentColor || '77, 171, 247'});
    }
    
    &:active {
      transform: scale(0.98);
    }
  `}
`;

export const Sidebar = styled.div`
  width: ${vp(72)};
  flex-shrink: 0;
  height: ${PANEL_HEIGHT};
  max-height: ${PANEL_HEIGHT};
  min-height: 0;
  background: ${GLASS_BG};
  border: ${GLASS_BORDER};
  border-radius: ${vp(12)};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${vp(16)} 0 ${vp(16)} 0;
  gap: ${vp(4)};
  overflow-y: auto;
  box-sizing: border-box;
  box-shadow: ${GLASS_SHADOW};
  position: relative;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    border-radius: ${vp(12)};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px 128px;
    opacity: 0.08;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &::-webkit-scrollbar {
    width: 0;
  }
`;

interface SidebarItemProps {
  active?: boolean;
}

export const SidebarItem = styled.button<SidebarItemProps>`
  width: ${vp(56)};
  height: ${vp(56)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${vp(4)};
  border-radius: ${vp(10)};
  cursor: pointer;
  transition: transform 140ms ease, background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  background: ${({ active, theme }) =>
    active ? 'linear-gradient(145deg, rgba(255, 182, 80, 0.72), rgba(255, 118, 197, 0.62))' : 'transparent'};
  border: ${({ active, theme }) =>
    active
      ? '1px solid rgba(255, 228, 160, 0.66)'
      : '1px solid rgba(255, 255, 255, 0.28)'};
  box-shadow: ${({ active }) =>
    active ? '0 8px 16px rgba(255, 121, 188, 0.34)' : 'none'};
  
  svg {
    width: ${vp(18)};
    height: ${vp(18)};
    color: ${({ active, theme }) =>
      active ? 'rgba(48, 25, 84, 0.95)' : `rgb(${theme.mutedTextColorSoft || '92, 95, 102'})`};
    transition: color 0.2s ease;
  }
  
  span {
    font-size: ${vp(9)};
    font-weight: 500;
    color: ${({ active, theme }) =>
      active ? 'rgba(48, 25, 84, 0.95)' : `rgb(${theme.mutedTextColorSoft || '92, 95, 102'})`};
    transition: color 0.2s ease;
  }
  
  &:hover {
    background: ${({ active, theme }) =>
      active ? `rgba(${theme.accentColor || '77, 171, 247'}, 0.28)` : 'rgba(255, 255, 255, 0.14)'};
    border-color: ${({ active, theme }) =>
      active ? `rgb(${theme.accentColor || '77, 171, 247'})` : `rgb(${theme.borderColorSoft || '55, 58, 64'})`};
    
    svg {
      color: ${({ active, theme }) =>
        active ? `rgb(${theme.accentColorHover || '116, 192, 252'})` : `rgb(${theme.accentColor || '77, 171, 247'})`};
    }
    
    span {
      color: ${({ active, theme }) =>
        active ? `rgb(${theme.fontColor || '193, 194, 197'})` : `rgb(${theme.accentColor || '77, 171, 247'})`};
    }
    transform: translateY(${vp(-1)});
  }
`;

export const SectionWrapper = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

interface SectionHeaderProps {
  expanded?: boolean;
}

export const SectionHeader = styled.button<SectionHeaderProps>`
  width: 100%;
  padding: ${vp(12)} ${vp(16)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    
    span { color: ${({ theme }) => `rgb(${theme.accentColor || '77, 171, 247'})`}; }
    svg { color: ${({ theme }) => `rgb(${theme.accentColor || '77, 171, 247'})`}; }
  }
  
  span {
    font-size: ${vp(12)};
    font-weight: 500;
    color: ${({ theme }) => `rgb(${theme.fontColor || '193, 194, 197'})`};
    transition: color 0.2s ease;
  }
  
  svg {
    width: ${vp(14)};
    height: ${vp(14)};
    color: ${({ theme }) => `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    transition: transform 0.25s ease, color 0.2s ease;
    transform: ${({ expanded }) => expanded ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

export const SectionContent = styled.div`
  padding: ${vp(16)} ${vp(16)} ${vp(18)};
  display: flex;
  flex-direction: column;
  gap: ${vp(16)};
`;

export const ControlRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vp(6)};
`;

export const ControlLabel = styled.label`
  font-size: ${vp(11)};
  color: ${({ theme }) => `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
  font-weight: 500;
  font-family: 'Nexa-Book', sans-serif;
`;

export const NumberInput = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: ${vp(10)};
  overflow: hidden;
  transition: all 0.15s ease;
  
  &:hover {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.12));
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

export const NumberButton = styled.button`
  width: ${vp(32)};
  height: ${vp(32)};
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Nexa-Book', sans-serif;
  
  svg {
    width: ${vp(12)};
    height: ${vp(12)};
    color: ${({ theme }) => `rgb(${theme.mutedTextColorSoft || '92, 95, 102'})`};
  }
  
  &:hover {
    background: linear-gradient(130deg, rgba(255, 194, 92, 0.46), rgba(255, 118, 198, 0.4));
    
    svg {
      color: rgba(255, 244, 255, 0.98);
    }
  }
`;

export const NumberValue = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${vp(12)};
  color: rgba(242, 248, 255, 0.96);
  font-weight: 500;
  font-family: 'Nexa-Book', sans-serif;
`;

export const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: ${vp(8)};

  > div {
    flex: 1;
  }
`;

/* Card-style block for tattoo (and similar) content - matches clothing Item content */
export const CardBlock = styled.div`
  width: 100%;
  padding: ${vp(14)} ${vp(16)};
  background-color: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: ${vp(8)};
  display: flex;
  flex-direction: column;
  gap: ${vp(14)};
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.38);
  }
`;

export const CardActionRow = styled.div`
  display: flex;
  gap: ${vp(8)};
  width: 100%;
  margin-top: ${vp(4)};
`;

/* Full-height layout for tattoos: scrollable list + Remove all pinned at bottom */
export const TattoosLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

export const TattoosTitle = styled.div`
  padding: ${vp(14)} ${vp(16)};
  border-bottom: ${({ theme }) => `1px solid rgba(${theme.borderColor || '44, 46, 51'}, 1)`};
  font-size: ${vp(13)};
  font-weight: 600;
  color: ${({ theme }) => `rgb(${theme.fontColor || '193, 194, 197'})`};
  font-family: 'Nexa-Book', sans-serif;
`;

export const TattoosZoneBlock = styled.div`
  padding: ${vp(12)} ${vp(16)} ${vp(16)};
  border-bottom: ${({ theme }) => `1px solid rgba(${theme.borderColor || '44, 46, 51'}, 1)`};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const TattoosZoneLabel = styled.div`
  font-size: ${vp(11)};
  font-weight: 500;
  color: ${({ theme }) => `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
  margin-bottom: ${vp(10)};
  font-family: 'Nexa-Book', sans-serif;
`;

export const TattoosScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => `rgb(${theme.secondaryBackground || '16, 17, 19'})`};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `rgb(${theme.borderColorSoft || '55, 58, 64'})`};
    border-radius: 4px;
  }
`;

/* Same as FooterButtons - no card, matches main panel footer */
export const TattoosBottomBar = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: ${vp(8)};
  padding: ${vp(16)} ${vp(16)} ${vp(20)};
  background: ${({ theme }) => `rgb(${theme.surfaceBackgroundAlt || '20, 21, 23'})`};
  border-top: ${({ theme }) => `1px solid rgba(${theme.borderColor || '44, 46, 51'}, 1)`};
`;

export const CameraButtons = styled.div`
  position: fixed;
  top: ${vp(20)};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: ${vp(10)};
  padding: ${vp(12)};
  background: ${GLASS_BG};
  border: ${GLASS_BORDER};
  border-radius: ${vp(12)};
  box-shadow: 0 ${vp(10)} ${vp(28)} rgba(0, 0, 0, 0.52);
  z-index: 100;
`;

interface CameraButtonProps {
  active?: boolean;
}

/* Same light blue style as Hat/Torso/Pants sidebar buttons */
export const CameraButton = styled.button<CameraButtonProps>`
  width: ${vp(50)};
  height: ${vp(50)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${vp(4)};
  background-color: ${({ active, theme }) =>
    active ? 'rgba(255, 146, 204, 0.6)' : 'rgba(255, 255, 255, 0.08)'};
  border: ${({ active, theme }) =>
    active
      ? '1px solid rgba(255, 216, 163, 0.76)'
      : '1px solid rgba(255, 255, 255, 0.2)'};
  border-radius: ${vp(4)};
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Nexa-Book', sans-serif;
  
  svg {
    width: ${vp(20)};
    height: ${vp(20)};
    color: ${({ active, theme }) =>
      active ? `rgb(${theme.accentColor || '77, 171, 247'})` : `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    transition: color 0.15s ease;
  }
  
  span {
    font-size: ${vp(8)};
    font-weight: 600;
    color: ${({ active, theme }) =>
      active ? `rgb(${theme.accentColor || '77, 171, 247'})` : `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-family: 'Nexa-Book', sans-serif;
  }
  
  &:hover {
    background-color: ${({ active, theme }) =>
      active ? `rgba(${theme.accentColor || '77, 171, 247'}, 0.2)` : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${({ active, theme }) =>
      active ? `rgb(${theme.accentColor || '77, 171, 247'})` : 'rgba(255, 255, 255, 0.2)'};
    
    svg, span {
      color: ${({ active, theme }) =>
        active ? `rgb(${theme.accentColor || '77, 171, 247'})` : `rgb(${theme.fontColor || '193, 194, 197'})`};
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const ControlsInfo = styled.div`
  position: fixed;
  left: 50%;
  bottom: ${vp(20)};
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${vp(20)};
  background: ${GLASS_BG};
  border: ${GLASS_BORDER};

  border-radius: ${vp(8)};
  padding: ${vp(10)} ${vp(20)};
  z-index: 100;
  
  span {
    font-size: ${vp(11)};
    color: ${({ theme }) => `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: ${vp(22)};
    height: ${vp(22)};
    padding: 0 ${vp(6)};
    background: linear-gradient(130deg, rgba(255, 191, 71, 0.82), rgba(255, 112, 194, 0.78));
    border: 1px solid rgba(255, 230, 170, 0.64);
    border-radius: ${vp(4)};
    font-size: ${vp(11)};
    font-weight: 600;
    color: rgba(50, 25, 88, 0.95);
    font-family: 'Nexa-Book', sans-serif;
  }
`;

export const ControlsDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => `rgba(${theme.accentColor || '77, 171, 247'}, 0.4)`};
`;
