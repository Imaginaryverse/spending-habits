import { SpendingCategory } from "@src/types";

/**
 * Returns true if the email is valid
 * @param email - email string
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // eslint-disable-next-line no-control-regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

/**
 * Returns an abbrevaition of the category name
 * @param category - spending category
 * @returns abbreviation of the category name
 */
export function getCategoryAbbreviation(category: SpendingCategory): string {
  switch (category.name) {
    case "Shopping":
      return "Shop.";
    case "Commuting":
      return "Com.";
    case "Entertainment":
      return "Ent.";
    case "Food":
      return category.name;
    case "Health":
      return "Hlth.";
    case "Groceries":
      return "Gro.";
    case "Other":
      return category.name;
    default:
      return "";
  }
}
