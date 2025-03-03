export type Environment = keyof typeof enviroments;

export const enviroments = {
  dev: '.env',
  test: '.env.test',
  stag: '.stag.env',
  prod: '.prod.env',
};