type ShowProps<T> = {
  children: React.ReactNode | ((meta: NonNullable<T>) => React.ReactNode);
  condition: T;
};

export function Show<T>({ children, condition }: ShowProps<T>) {
  if (!condition) {
    return null;
  }
  return typeof children === 'function' ? children(condition) : children;
}
