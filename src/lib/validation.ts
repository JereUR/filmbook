import { z } from "zod";

const requiredString = z.string().trim().min(1, "Requerido");

export const signUpSchema = z.object({
  email: requiredString.email("Correo electrónico inválido."),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Solo esta permitido palabras, números, _ y -.",
  ),
  password: requiredString.min(
    8,
    "Contraseña debe tener al menos 8 caracteres.",
  ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;
