export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}

export interface VectorProps extends React.SVGProps<SVGSVGElement> {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "white"
    | "black";
}

export interface TextLogoProps {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "white"
    | "black";
}
