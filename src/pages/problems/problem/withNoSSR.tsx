import dynamic from "next/dynamic";

export function withNoSSR<P>(Component: React.FunctionComponent<P>) {
  return dynamic(() => Promise.resolve(Component), { ssr: false });
}
  
