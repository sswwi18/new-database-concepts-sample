export interface Post {
  content: Array<string>;
  image: boolean;
  like: number;
  dislike: number;
  hashtags: Array<string>; 
  id: number;
}
