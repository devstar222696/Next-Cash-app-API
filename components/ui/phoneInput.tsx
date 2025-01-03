import { FC } from 'react';
import IntlTelInput from 'intl-tel-input/react';
import 'intl-tel-input/build/css/intlTelInput.css';

interface PhoneInputProps {
  disabled?: boolean;
  value?: string;
  onChangeNumber?: (arg:string) => void;
  onChangeValidity?: (isValid: boolean) => void;
  onChangeErrorCode?: (errorCode: number | null) => void;
}

const PhoneInput: FC<PhoneInputProps> = ({
  disabled = false,
  value = '',
  onChangeNumber,
  onChangeValidity,
  onChangeErrorCode
}) => {
  return (
    <div className='phone-input'>
      <IntlTelInput
        onChangeNumber={onChangeNumber}
        onChangeValidity={onChangeValidity}
        onChangeErrorCode={onChangeErrorCode}
        inputProps={{
            value,
          disabled,
          className:
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        }}
        initOptions={{
          initialCountry: 'us',
          allowDropdown: false,
          loadUtils: () => import('intl-tel-input/build/js/utils.js' as string)
        }}
      />
    </div>
  );
};

export default PhoneInput;