import { useCallback } from 'react';
import styled from 'styled-components';
import { vp } from '../../../styles/scale';

interface ColorInputProps {
  title?: string;
  colors?: number[][];
  defaultValue?: number;
  clientValue?: number;
  onChange: (value: number) => void;
}

interface ButtonProps {
  selected: boolean;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${vp(8)};
`;

const Label = styled.span`
  font-size: ${vp(11)};
  color: rgba(232, 242, 255, 0.9);
  font-weight: 500;
`;

const ColorsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${vp(5)};
  padding: ${vp(10)};
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: ${vp(10)};
`;

const ColorButton = styled.button<ButtonProps>`
  width: ${vp(22)};
  height: ${vp(22)};
  border-radius: ${vp(4)};
  border: 2px solid
    ${({ selected, theme }) =>
      selected
        ? `rgb(${theme.accentColor || '77, 171, 247'})`
        : 'rgba(255, 255, 255, 0.42)'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ selected }) => selected ? '0 0 8px rgba(34, 139, 230, 0.4)' : 'none'};

  &:hover {
    border-color: ${({ theme }) => `rgb(${theme.accentColor || '77, 171, 247'})`};
    transform: scale(1.1);
  }
`;

const ColorInput: React.FC<ColorInputProps> = ({ title, colors = [], defaultValue, onChange }) => {
  const selectColor = useCallback(
    (color: number) => {
      onChange(color);
    },
    [onChange],
  );

  return (
    <Container>
      {title && <Label>{title}</Label>}
      <ColorsWrapper data-no-zoom-scroll="true">
        {colors.map((color, index) => (
          <ColorButton
            key={index}
            style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
            selected={defaultValue === index}
            onClick={() => selectColor(index)}
          />
        ))}
      </ColorsWrapper>
    </Container>
  );
};

export default ColorInput;
