import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { vp } from '../../styles/scale';
import Nui from '../../Nui';

type NotifyType = 'success' | 'error' | 'inform';

interface NotifyItem {
  id: number;
  title: string;
  description?: string;
  type: NotifyType;
}

const Wrapper = styled.div`
  position: fixed;
  right: ${vp(16)};
  top: ${vp(16)};
  z-index: 2100;
  display: flex;
  flex-direction: column;
  gap: ${vp(8)};
  pointer-events: none;
`;

const Card = styled.div<{ ntype: NotifyType }>`
  width: min(${vp(360)}, calc(100vw - ${vp(32)}));
  border-radius: ${vp(12)};
  padding: ${vp(10)} ${vp(12)};
  border: 1px solid
    ${({ ntype }) =>
      ntype === 'success'
        ? 'rgba(143, 255, 184, 0.55)'
        : ntype === 'error'
          ? 'rgba(255, 143, 163, 0.55)'
          : 'rgba(255, 223, 232, 0.62)'};
  background:
    linear-gradient(145deg, rgba(255, 166, 113, 0.2), rgba(255, 122, 182, 0.2) 50%, rgba(120, 144, 255, 0.14) 100%),
    rgba(24, 31, 46, 0.84);
  box-shadow: 0 ${vp(14)} ${vp(40)} rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  color: #fff;
`;

const Title = styled.div`
  font-size: ${vp(13)};
  font-weight: 700;
  margin-bottom: ${vp(2)};
`;

const Description = styled.div`
  font-size: ${vp(12)};
  color: rgba(255, 255, 255, 0.88);
  font-weight: 500;
`;

let counter = 1;

const InternalNotify = () => {
  const [items, setItems] = useState<NotifyItem[]>([]);

  useEffect(() => {
    Nui.onEvent(
      'internal_notify_show',
      (payload: { title?: string; description?: string; type?: NotifyType; duration?: number }) => {
        const id = counter++;
        const entry: NotifyItem = {
          id,
          title: payload?.title || 'Notification',
          description: payload?.description || '',
          type: payload?.type || 'inform',
        };

        setItems(prev => [entry, ...prev].slice(0, 4));

        const duration = Number(payload?.duration || 3000);
        window.setTimeout(() => {
          setItems(prev => prev.filter(item => item.id !== id));
        }, duration);
      },
    );
  }, []);

  if (!items.length) return null;

  return (
    <Wrapper>
      {items.map(item => (
        <Card key={item.id} ntype={item.type}>
          <Title>{item.title}</Title>
          {item.description ? <Description>{item.description}</Description> : null}
        </Card>
      ))}
    </Wrapper>
  );
};

export default InternalNotify;
