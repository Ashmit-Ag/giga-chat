import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function ErrorBlock({ message }: { message: string }) {
  const icon = <IconAlertCircle size={16} />;

  return (
    <Alert 
      variant="filled" // "filled" looks great in dark mode
      color="red" 
      title="Error occurred" 
      icon={icon}
      radius="md"
    >
      {message}
    </Alert>
  );
}