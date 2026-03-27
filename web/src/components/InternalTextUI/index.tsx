import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { vp } from '../../styles/scale';
import Nui from '../../Nui';

const Wrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  left: ${vp(20)};
  top: 50%;
  transform: translateY(-50%);
  z-index: 1500;
  pointer-events: none;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 120ms ease;
`;

const Card = styled.div`
  min-width: ${vp(220)};
  max-width: ${vp(340)};
  border-radius: ${vp(12)};
  padding: ${vp(10)} ${vp(12)};
  border: 1px solid rgba(255, 223, 232, 0.62);
  background:
    linear-gradient(145deg, rgba(255, 166, 113, 0.2), rgba(255, 122, 182, 0.2) 50%, rgba(120, 144, 255, 0.14) 100%),
    rgba(24, 31, 46, 0.84);
  box-shadow: 0 ${vp(14)} ${vp(40)} rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: ${vp(13)};
  font-weight: 600;
  line-height: 1.35;
  text-shadow: 0 0 ${vp(8)} rgba(255, 255, 255, 0.25);
`;

const InternalTextUI = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    Nui.onEvent('internal_textui_show', (payload: { text?: string }) => {
      setText(payload?.text || '');
      setVisible(true);
    });

    Nui.onEvent('internal_textui_hide', () => {
      setVisible(false);
    });
  }, []);

  if (!text && !visible) return null;

  return (
    <Wrapper visible={visible}>
      <Card>{text}</Card>
    </Wrapper>
  );
};

export default InternalTextUI;
