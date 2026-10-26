export type ReceiptScanFabPropsType = {
  onScan: (file: File) => void;
  isScanning: boolean;
  disabled?: boolean;
};
