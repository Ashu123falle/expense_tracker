import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const links = user
    ? [
        { label: "Dashboard", path: "/" },
        { label: "Expenses", path: "/expenses" },
        { label: "Categories", path: "/categories" },
        { label: "Account", path: "/accounts" },
        { label: "Reports", path: "/reports" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", action: handleLogout },
      ]
    : [
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Expense Manager
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                  <List>
                    {links.map((link, index) => (
                      <ListItem
                        button
                        key={index}
                        component={link.path ? Link : "button"}
                        to={link.path || "#"}
                        onClick={link.action ? link.action : () => setDrawerOpen(false)}
                      >
                        <ListItemText primary={link.label} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            links.map((link, index) =>
              link.path ? (
                <Button
                  color="inherit"
                  key={index}
                  component={Link}
                  to={link.path}
                >
                  {link.label}
                </Button>
              ) : (
                <Button color="inherit" key={index} onClick={link.action}>
                  {link.label}
                </Button>
              )
            )
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
