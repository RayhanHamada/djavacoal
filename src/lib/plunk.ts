import Plunk from "@plunk/node";

export function getPlunk(apiKey: string) {
  return new Plunk(apiKey);
}
