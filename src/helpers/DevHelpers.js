export const DevHelpers = {
  isDevelopment: () =>
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
}
