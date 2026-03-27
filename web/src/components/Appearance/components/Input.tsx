import { useCallback } from 'react';
import styled from 'styled-components';
import { vp } from '../../../styles/scale';

interface InputProps {
  title?: string;
  min?: number;
  max?: number;
  blacklisted?: number[];
  defaultValue: number;
  clientValue: number;
  onChange: (value: number) => void;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${vp(10)};
`;

const Label = styled.span`
  font-size: ${vp(11)};
  color: rgba(232, 242, 255, 0.92);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.5);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${vp(10)};
  padding: ${vp(8)} ${vp(10)};
  background: linear-gradient(135deg, rgba(255, 190, 120, 0.35), rgba(255, 128, 178, 0.34));
  border: 1px solid rgba(255, 216, 224, 0.7);
  border-radius: ${vp(14)};
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    0 ${vp(8)} ${vp(20)} rgba(255, 109, 160, 0.36);
  transition: all 0.22s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(125deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.1) 35%, rgba(255, 255, 255, 0.03) 100%);
    opacity: 0.95;
  }

  &:hover {
    border-color: rgba(255, 232, 238, 0.85);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 ${vp(8)} ${vp(20)} rgba(255, 109, 160, 0.44);
  }

  &:focus-within {
    border-color: ${({ theme }) => `rgba(${theme.accentColor || '77, 171, 247'}, 0.95)`};
    box-shadow:
      0 0 0 ${vp(3)} ${({ theme }) => `rgba(${theme.accentColor || '77, 171, 247'}, 0.35)`},
      inset 0 1px 0 rgba(255, 255, 255, 0.98),
      inset 0 -1px 0 rgba(255, 255, 255, 0.38),
      0 ${vp(12)} ${vp(20)} rgba(11, 20, 38, 0.5),
      0 ${vp(24)} ${vp(54)} rgba(4, 10, 24, 0.6);
  }
`;

const Slider = styled.input`
  position: relative;
  z-index: 1;
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

const ValueInput = styled.input`
  position: relative;
  z-index: 1;
  width: ${vp(48)};
  text-align: right;
  font-size: ${vp(12)};
  color: rgba(241, 247, 255, 0.98);
  font-weight: 500;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Nexa-Book', sans-serif;
  text-shadow: 0 2px 10px rgba(10, 18, 35, 0.6);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
`;

const Input: React.FC<InputProps> = ({ title, min = 0, max = 255, blacklisted = [], defaultValue, clientValue, onChange }) => {
  const isBlacklisted = function (_value: number, blacklisted: number[]) {
    if (!blacklisted || blacklisted.length === 0) {
      return false;
    }
    for (var i = 0; i < blacklisted.length; i++) {
      // Use strict comparison and handle type coercion
      const blacklistValue = Number(blacklisted[i]);
      if (!isNaN(blacklistValue) && blacklistValue === _value) {
        return true;
      }
    }
    return false;
  }

  const normalize = function (_value: number) {
    if (_value < min) {
      _value = max;
    } else if (_value > max) {
      _value = min;
    }

    return _value;
  }

  const checkBlacklisted = function (_value: number, blacklisted: number[], factor: number, currentValue: number, minVal: number, maxVal: number) {
    // Normalize the input value first
    let targetValue = normalize(_value);
    
    // If no blacklist, just return the normalized value
    if (!blacklisted || blacklisted.length === 0) {
      return targetValue;
    }
    
    if(factor === 0) {
      // Direct input - check if value is blacklisted
      if(!isBlacklisted(targetValue, blacklisted)) {
        return targetValue;
      }
      // If blacklisted, find nearest non-blacklisted value
      factor = targetValue > currentValue ? 1 : -1;
    }

    // When factor is set (button click), check if target value is blacklisted
    // If not blacklisted, return it. If blacklisted, find next non-blacklisted value.
    if (!isBlacklisted(targetValue, blacklisted)) {
      return targetValue;
    }

    // Target value is blacklisted, find next non-blacklisted value
    let nextValue = targetValue;
    let attempts = 0;
    const maxAttempts = maxVal - minVal + 1; // Prevent infinite loops
    
    // Skip blacklisted values in the direction we're moving
    do {
      nextValue = normalize(nextValue + factor);
      attempts++;
      // Safety check to prevent infinite loops
      if (attempts >= maxAttempts) {
        // If we've tried everything, just return the target value (even if blacklisted)
        return targetValue;
      }
    } while (isBlacklisted(nextValue, blacklisted));
    
    return nextValue;
  };

  const getSafeValue = useCallback(
    (_value: number, factor: number, currentValue: number) => {
      let safeValue = _value;
      return checkBlacklisted(safeValue, blacklisted, factor, currentValue, min, max);
    },
    [min, max, blacklisted],
  );

  const handleChange = useCallback(
    (_value: any) => {
      let parsedValue;

      if (_value === null || _value === undefined) return;
      if (Number.isNaN(_value)) return;

      if (typeof _value === 'string') {
        parsedValue = parseInt(_value, 10);
        if (isNaN(parsedValue)) return;
      } else {
        parsedValue = _value;
      }

      // Use the current displayed value as the base for comparison
      const baseValue = defaultValue !== undefined ? defaultValue : clientValue;
      const safeValue = getSafeValue(parsedValue, 0, baseValue);
      onChange(safeValue);
    },
    [getSafeValue, onChange, defaultValue, clientValue],
  );

  const labelText = title ? `${title} (${max})` : undefined;

  return (
    <Container>
      {labelText && <Label>{labelText}</Label>}
      <InputWrapper>
        <Slider
          type="range"
          min={min}
          max={max}
          step={1}
          value={defaultValue} 
          onChange={e => handleChange(e.target.value)}
        />
        <ValueInput
          type="number"
          min={min}
          max={max}
          step={1}
          value={defaultValue}
          onChange={e => handleChange(e.target.value)}
        />
      </InputWrapper>
    </Container>
  );
};

export default Input;
