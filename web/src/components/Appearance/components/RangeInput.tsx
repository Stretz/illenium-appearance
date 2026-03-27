import { useCallback } from 'react';
import styled from 'styled-components';
import { vp } from '../../../styles/scale';

interface RangeInputProps {
  title?: string;
  min: number;
  max: number;
  factor?: number;
  defaultValue?: number;
  clientValue?: number;
  onChange: (value: number) => void;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${vp(6)};
`;

const Label = styled.label`
  font-size: ${vp(11)};
  color: rgba(232, 242, 255, 0.9);
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${vp(10)};
  padding: ${vp(8)} ${vp(10)};
  background: linear-gradient(135deg, rgba(255, 190, 120, 0.35), rgba(255, 128, 178, 0.34));
  border: 1px solid rgba(255, 216, 224, 0.7);
  border-radius: ${vp(10)};
  overflow: hidden;
  transition: all 0.15s ease;
  
  &:hover {
    border-color: rgba(255, 232, 238, 0.85);
  }
`;

const Slider = styled.input`
  flex: 1;
  height: ${vp(7)};
  appearance: none;
  border-radius: ${vp(999)};
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.18));
  border: none;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${vp(16)};
    height: ${vp(16)};
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.92);
    background: linear-gradient(145deg, rgba(255, 183, 72, 0.98), rgba(255, 134, 86, 0.96));
    box-shadow: 0 0 ${vp(8)} rgba(255, 174, 88, 0.55);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: ${vp(16)};
    height: ${vp(16)};
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.92);
    background: linear-gradient(145deg, rgba(255, 183, 72, 0.98), rgba(255, 134, 86, 0.96));
    box-shadow: 0 0 ${vp(8)} rgba(255, 174, 88, 0.55);
    cursor: pointer;
  }
`;

const Value = styled.span`
  width: ${vp(48)};
  text-align: right;
  font-size: ${vp(12)};
  color: rgba(241, 247, 255, 0.98);
  font-weight: 500;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Nexa-Book', sans-serif;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
`;

const RangeInput: React.FC<RangeInputProps> = ({
  min,
  max,
  factor = 1,
  title,
  defaultValue = 0,
  onChange,
}) => {
  const handleSliderChange = useCallback(
    (value: string) => {
      const parsed = parseFloat(value);
      if (Number.isNaN(parsed)) return;
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(Math.round(clamped * 100) / 100);
    },
    [onChange, min, max],
  );

  const displayValue = factor < 1 
    ? defaultValue.toFixed(1) 
    : defaultValue.toString();

  const labelText = title ? `${title} (${max})` : undefined;

  return (
    <Container>
      {labelText && <Label>{labelText}</Label>}
      <InputWrapper>
        <Slider
          type="range"
          min={min}
          max={max}
          step={factor}
          value={defaultValue}
          onChange={e => handleSliderChange(e.target.value)}
        />
        <Value
          as="input"
          type="number"
          min={min}
          max={max}
          step={factor}
          value={defaultValue}
          onChange={e => handleSliderChange(e.target.value)}
        />
      </InputWrapper>
    </Container>
  );
};

export default RangeInput;
