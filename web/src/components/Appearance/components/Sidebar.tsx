import React from 'react';
import styled from 'styled-components';
import {
  IconUser,
  IconMoodSmile,
  IconEye,
  IconDroplet,
  IconScissors,
  IconBrush,
  IconWriting,
  IconShirt,
  IconDeviceWatch,
} from '@tabler/icons-react';
import { FaHatCowboy, FaTshirt } from 'react-icons/fa';
import { GiTrousers } from 'react-icons/gi';
import { ClothesState } from '../interfaces';
import Locales from '../../../shared/interfaces/locales';
import { vp } from '../../../styles/scale';

interface SidebarConfig {
  ped?: boolean;
  headBlend?: boolean;
  faceFeatures?: boolean;
  headOverlays?: boolean;
  components?: boolean;
  props?: boolean;
  tattoos?: boolean;
}

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  config?: SidebarConfig;
  clothes?: ClothesState;
  onSetClothes?: (key: keyof ClothesState) => void;
  locales?: Locales;
}

const SidebarContainer = styled.div`
  width: ${vp(72)};
  height: 100%;
  align-self: stretch;
  background: linear-gradient(145deg, rgba(255, 152, 216, 0.24), rgba(139, 119, 255, 0.16) 45%, rgba(72, 207, 255, 0.12) 100%);
  border: 1px solid rgba(255, 255, 255, 0.54);
  border-radius: ${vp(12)};
  margin: 0 ${vp(10)} 0 ${vp(8)};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${vp(10)} 0;
  overflow-y: auto;
  box-shadow: 10px 0 40px rgba(0, 0, 0, 0.5);
  position: relative;
  box-sizing: border-box;

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
    opacity: 0.08;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    border-radius: 12px;
    background: linear-gradient(125deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 24%, rgba(255, 255, 255, 0.02) 52%, rgba(255, 255, 255, 0.14) 100%);
  }

  > * {
    position: relative;
    z-index: 1;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

interface SidebarItemProps {
  active: boolean;
}

const SidebarItem = styled.button<SidebarItemProps>`
  width: ${vp(56)};
  height: ${vp(56)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${vp(4)};
  border-radius: ${vp(10)};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ active, theme }) =>
    active ? 'linear-gradient(145deg, rgba(255, 182, 80, 0.72), rgba(255, 118, 197, 0.62))' : 'rgba(255, 255, 255, 0.08)'};
  border: ${({ active, theme }) =>
    active
      ? '1px solid rgba(255, 228, 160, 0.66)'
      : '1px solid rgba(255, 255, 255, 0.2)'};
  box-shadow: ${({ active }) =>
    active ? '0 8px 16px rgba(255, 121, 188, 0.34)' : 'none'};
  
  svg {
    width: ${vp(18)};
    height: ${vp(18)};
    color: ${({ active, theme }) =>
      active ? 'rgba(48, 25, 84, 0.95)' : `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    transition: color 0.2s ease;
  }
  
  span {
    font-size: ${vp(9)};
    font-weight: 500;
    color: ${({ active, theme }) =>
      active ? 'rgba(48, 25, 84, 0.95)' : `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    transition: color 0.2s ease;
    font-family: 'Nexa-Book', sans-serif;
  }
  
  &:hover {
    background: ${({ active, theme }) =>
      active ? 'linear-gradient(145deg, rgba(255, 188, 92, 0.78), rgba(255, 126, 200, 0.68))' : 'rgba(255, 255, 255, 0.14)'};
    border-color: ${({ active, theme }) =>
      active ? 'rgba(255, 232, 168, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
    
    svg,
    span {
      color: ${({ active, theme }) =>
        active ? 'rgba(42, 22, 74, 0.98)' : `rgb(${theme.fontColor || '193, 194, 197'})`};
    }
  }
`;

const SidebarCategories = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: ${vp(4)};
  min-height: 0;
`;

const ClothesSection = styled.div`
  flex-shrink: 0;
  padding-top: ${vp(8)};
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${vp(4)};
`;

interface ClothesButtonProps {
  active: boolean;
}

const ClothesButton = styled.button<ClothesButtonProps>`
  width: ${vp(56)};
  height: ${vp(56)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${vp(4)};
  border-radius: ${vp(10)};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ active, theme }) =>
    active ? 'linear-gradient(145deg, rgba(255, 182, 80, 0.72), rgba(255, 118, 197, 0.62))' : 'rgba(255, 255, 255, 0.08)'};
  border: ${({ active, theme }) =>
    active
      ? '1px solid rgba(255, 228, 160, 0.66)'
      : '1px solid rgba(255, 255, 255, 0.2)'};
  box-shadow: ${({ active }) =>
    active ? '0 8px 16px rgba(255, 121, 188, 0.34)' : 'none'};
  
  svg {
    width: ${vp(18)};
    height: ${vp(18)};
    color: ${({ active, theme }) =>
      active ? 'rgba(48, 25, 84, 0.95)' : `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
  }
  
  span {
    font-size: ${vp(9)};
    font-weight: 500;
    color: ${({ active, theme }) =>
      active ? 'rgba(48, 25, 84, 0.95)' : `rgb(${theme.mutedTextColor || '144, 146, 150'})`};
    font-family: 'Nexa-Book', sans-serif;
  }
  
  &:hover {
    background: ${({ active, theme }) =>
      active ? 'linear-gradient(145deg, rgba(255, 188, 92, 0.78), rgba(255, 126, 200, 0.68))' : 'rgba(255, 255, 255, 0.14)'};
    
    svg, span {
      color: ${({ active, theme }) =>
        active ? 'rgba(42, 22, 74, 0.98)' : `rgb(${theme.fontColor || '193, 194, 197'})`};
    }
  }
`;

const CATEGORY_IDS = [
  { id: 'ped', labelKey: 'ped', icon: IconUser, configKey: 'ped' },
  { id: 'headBlend', labelKey: 'headBlend', icon: IconMoodSmile, configKey: 'headBlend' },
  { id: 'faceFeatures', labelKey: 'faceFeatures', icon: IconEye, configKey: 'faceFeatures' },
  { id: 'headOverlays', labelKey: 'headOverlays', icon: IconDroplet, configKey: 'headOverlays' },
  { id: 'hair', labelKey: 'hair', icon: IconScissors, configKey: 'headOverlays' },
  { id: 'makeup', labelKey: 'makeup', icon: IconBrush, configKey: 'headOverlays' },
  { id: 'tattoos', labelKey: 'tattoos', icon: IconWriting, configKey: 'tattoos' },
  { id: 'components', labelKey: 'components', icon: IconShirt, configKey: 'components' },
  { id: 'props', labelKey: 'props', icon: IconDeviceWatch, configKey: 'props' },
] as const;

const DEFAULT_LABELS: Record<string, string> = {
  ped: 'Characters', headBlend: 'Face', faceFeatures: 'Features', headOverlays: 'Skin',
  hair: 'Hair', makeup: 'Makeup', tattoos: 'Tattoos', components: 'Clothing', props: 'Accessories',
};

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategoryChange, config, clothes, onSetClothes, locales }) => {
  // Filter categories based on config
  const categories = CATEGORY_IDS.filter(category => {
    if (!config) return true; // Show all if no config
    const configValue = config[category.configKey as keyof SidebarConfig];
    return configValue !== false; // Show if true or undefined
  });

  const getLabel = (key: string) => (locales?.sidebar as Record<string, string>)?.[key] ?? DEFAULT_LABELS[key] ?? key;
  const clothesLabels = locales?.sidebar?.clothes;

  return (
    <SidebarContainer>
      <SidebarCategories>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <SidebarItem
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon stroke={1.5} />
              <span>{getLabel(category.labelKey)}</span>
            </SidebarItem>
          );
        })}
      </SidebarCategories>
      {clothes && onSetClothes && (
        <ClothesSection>
          <ClothesButton active={!!clothes.head} onClick={() => onSetClothes('head')} title={clothesLabels?.hat ?? 'Hat'}>
            <FaHatCowboy size={18} />
            <span>{clothesLabels?.hat ?? 'Hat'}</span>
          </ClothesButton>
          <ClothesButton active={!!clothes.body} onClick={() => onSetClothes('body')} title={clothesLabels?.torso ?? 'Torso'}>
            <FaTshirt size={18} />
            <span>{clothesLabels?.torso ?? 'Torso'}</span>
          </ClothesButton>
          <ClothesButton active={!!clothes.bottom} onClick={() => onSetClothes('bottom')} title={clothesLabels?.pants ?? 'Pants'}>
            <GiTrousers size={18} />
            <span>{clothesLabels?.pants ?? 'Pants'}</span>
          </ClothesButton>
        </ClothesSection>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
