/** Play route — transparent shell so ambient backdrop shows through. */
export default function ArtistPlayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="relative -mb-16 bg-transparent">{children}</div>;
}
