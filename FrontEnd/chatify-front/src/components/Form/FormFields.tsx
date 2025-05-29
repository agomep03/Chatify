import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Field {
  name: string;
  label: string;
  type: string;
}

interface FormFieldsProps {
  fields: Field[];
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

const FormFields = ({
  fields,
  formData,
  onChange,
  loading = false,
}: FormFieldsProps) => {
  const theme = useTheme();

  return (
    <>
      {fields.map((field) => (
        <TextField
          key={field.name}
          fullWidth
          label={field.label}
          type={field.type}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={onChange}
          margin="normal"
          required
          disabled={loading}
          sx={{
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.custom.outlinedBorder,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.text.primary,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.custom.outlinedBorder,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.text.primary,
              },
            },
            "& input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
              WebkitTextFillColor: theme.palette.text.primary,
            },
          }}
        />
      ))}
    </>
  );
};

export default FormFields;
