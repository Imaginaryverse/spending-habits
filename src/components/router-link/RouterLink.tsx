import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";

export type RouterLinkProps = ReactRouterLinkProps & MuiLinkProps;

export function RouterLink({ to, replace, state, ...rest }: RouterLinkProps) {
  return (
    <MuiLink
      component={ReactRouterLink}
      to={to}
      replace={replace}
      state={state}
      {...rest}
    />
  );
}
