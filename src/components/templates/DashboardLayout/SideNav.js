import React, { useContext, useState, useEffect } from "react";
import { Divider, ListItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SideNav = () => {
  const classes = useStyles();
  const history = useHistory();

  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => {
    if (expanded === panel) {
      setExpanded("");
    } else {
      setExpanded(panel);
    }
  };

  return (
    <div className="sideNav">
      <ul>
        <ListItem button>
          <NavLink activeClassName="active" to="/Profile">
            Profile
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink activeClassName="active" to="/watchlist">
            Watchlist
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink activeClassName="active" to="/my_bids?s=0">
            My Bids
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink activeClassName="active" to="/notifications">
            My Notifications
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink activeClassName="active" to="/mytickets">
            My Tickets
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink activeClassName="active" to="/saved_cards">
            Saved Cards
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink activeClassName="active" to="/saved_search">
            Saved Searches
          </NavLink>
        </ListItem>
      </ul>
    </div>
  );
};

export default SideNav;
