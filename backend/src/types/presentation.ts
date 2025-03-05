export type Slide = {
  title: string;
  content: string[];
  imageUrl?: string;
};

export type PresentationOptions = {
  theme?: string;
  slideCount?: number;
  includeImages?: boolean;
};

export type Presentation = {
  id: string;
  slides: Slide[];
  theme: string;
  createdAt: string;
  downloadUrl: string;
};
