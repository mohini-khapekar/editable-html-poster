export interface ElementData {
  id: string;
  tagName: string;
  textContent: string;
  attributes: Record<string, string>;
  styles: Record<string, string>;
}

export interface Position {
  x: number;
  y: number;
}
