import styled from 'styled-components';
import { useState, useCallback } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing?.sm || '8px'};
`;

const Label = styled.label`
  font-size: ${(props: any) => props.theme.typography?.fontSize?.sm || '14px'};
  font-weight: ${(props: any) => props.theme.typography?.fontWeight?.medium || 500};
  color: ${(props: any) => props.theme.colors?.text?.primary || '#f8fafc'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Value = styled.span`
  font-size: ${(props: any) => props.theme.typography?.fontSize?.sm || '14px'};
  font-weight: ${(props: any) => props.theme.typography?.fontWeight?.normal || 400};
  color: ${(props: any) => props.theme.colors?.text?.secondary || '#cbd5e1'};
  background: transparent;
  padding: 0;
  border-radius: 0;
  min-width: 40px;
  text-align: center;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 2px;
  background: linear-gradient(135deg, rgba(255, 190, 120, 0.35), rgba(255, 128, 178, 0.34));
  border: 1px solid rgba(255, 216, 224, 0.7);
  border-radius: 14px;
`;

const Track = styled.div`
  width: 100%;
  height: 7px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.18));
  border-radius: ${(props: any) => props.theme.borderRadius?.full || '9999px'};
  position: relative;
  overflow: hidden;
`;

const Progress = styled.div<{ percentage: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.22) 100%);
  border-radius: ${(props: any) => props.theme.borderRadius?.full || '9999px'};
  transition: width 0.15s ease;
`;

const Thumb = styled.div<{ percentage: number; disabled?: boolean }>`
  position: absolute;
  top: 50%;
  left: ${props => props.percentage}%;
  transform: translate(-50%, -50%);
  
  width: 16px;
  height: 16px;
  background: linear-gradient(145deg, rgba(255, 183, 72, 0.98), rgba(255, 134, 86, 0.96));
  border: 2px solid rgba(255, 255, 255, 0.92);
  border-radius: ${(props: any) => props.theme.borderRadius?.full || '9999px'};
  box-shadow: 0 0 8px rgba(255, 174, 88, 0.55);
  
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(${props => props.disabled ? 1 : 1.1});
    box-shadow: ${(props: any) => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(${props => props.disabled ? 1 : 1.2});
  }
  
  ${props => props.disabled && `
    opacity: 0.5;
    background: ${props.theme.colors?.secondary || '#64748b'};
  `}
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  step = 1,
  onChange,
  label,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  }, [onChange]);
  
  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <Container>
      {label && (
        <Label>
          {label}
          <Value>{value}</Value>
        </Label>
      )}
      <SliderContainer>
        <Track>
          <Progress percentage={percentage} />
        </Track>
        <Thumb 
          percentage={percentage} 
          disabled={disabled}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <HiddenInput
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
      </SliderContainer>
    </Container>
  );
};
