import { Box, TextField } from "@mui/material";

interface SupabaseFormFieldsProps {
  url: string;
  apiKey: string;
  onUrlChange: (value: string) => void;
  onKeyChange: (value: string) => void;
}

export const SupabaseFormFields = ({
  url,
  apiKey,
  onUrlChange,
  onKeyChange,
}: SupabaseFormFieldsProps) => {
  return (
    <Box sx={{ my: 3 }}>
      <TextField
        label="Supabase Project URL"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="https://your-project.supabase.co"
        helperText="Find this in your Supabase project settings under API"
      />
      <TextField
        label="Supabase Publishable Key"
        value={apiKey}
        onChange={(e) => onKeyChange(e.target.value)}
        fullWidth
        margin="normal"
        type="password"
        placeholder="your-publishable-key"
        helperText="Find this in your Supabase project settings under API (previously called 'anon key')"
      />
    </Box>
  );
};
