type Props = {
  children: string;
};

export default function PageHeader({ children }: Props) {
  return (
    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-300">{children}</h3>
  );
}
