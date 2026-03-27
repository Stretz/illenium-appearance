import styled from 'styled-components';
import { useState, ReactNode, useEffect, useRef } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { useSpring, animated } from 'react-spring';
import { vp } from '../../../styles/scale';

interface ItemProps {
  title?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}

const Container = styled.div`
  width: 100%;
  border-bottom: ${({ theme }) => `1px solid rgba(${theme.borderColor || '44, 46, 51'}, 1)`};
`;

interface HeaderProps {
  expanded: boolean;
}

const Header = styled.button<HeaderProps>`
  width: 100%;
  padding: ${vp(12)} ${vp(16)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Nexa-Book', sans-serif;
  transition: background 180ms ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  span {
    font-size: ${vp(12)};
    font-weight: 500;
    color: ${({ theme }) => `rgb(${theme.fontColor || '193, 194, 197'})`};
  }
  
  svg {
    width: ${vp(14)};
    height: ${vp(14)};
    color: ${({ theme }) => `rgb(${theme.accentColor || '77, 171, 247'})`};
    transition: transform 0.25s ease;
    transform: ${({ expanded }) => expanded ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const Content = styled.div`
  padding: ${vp(16)} ${vp(16)} ${vp(18)};
  display: flex;
  flex-direction: column;
  gap: ${vp(16)};
  max-height: calc(100vh - ${vp(320)});
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  &::-webkit-scrollbar {
    width: ${vp(5)};
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.38);
    border-radius: ${vp(5)};
  }
`;

const Item: React.FC<ItemProps> = ({ children, title, defaultOpen = false }) => {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(contentRef.current.scrollHeight);
  }, [children, expanded]);

  const contentAnim = useSpring({
    opacity: expanded ? 1 : 0,
    height: expanded ? height : 0,
    config: { tension: 280, friction: 30 },
  });

  return (
    <Container>
      <Header expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <span>{title}</span>
        <IconChevronDown stroke={1.5} />
      </Header>
      <animated.div style={{ overflow: 'hidden', ...contentAnim }}>
        <Content ref={contentRef} data-no-zoom-scroll="true">
          {children}
        </Content>
      </animated.div>
    </Container>
  );
};

export default Item;
