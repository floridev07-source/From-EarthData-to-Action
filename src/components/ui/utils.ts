export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const append = (value: ClassValue): void => {
    if (!value && value !== 0) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(append);
      return;
    }

    if (typeof value === "number") {
      classes.push(String(value));
      return;
    }

    if (typeof value === "string") {
      classes.push(value);
    }
  };

  inputs.forEach(append);

  return classes.join(" ");
}
