import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import {Home, People, PeopleAlt, BarChart, PeopleOutline} from '@material-ui/icons'
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const apiBaseUrl = "/";

const useStyles = makeStyles((theme) => ({
  // table: {
  //   minWidth: 650,
  // },
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    width: '50%',
    minHeight: 43,
    paddingTop: 12,
    zIndex: 1,
    margin: 'auto',
  },
  
  appBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: '#00bcd4',
  },

  homeButton: {
    marginLeft: theme.spacing(1),
    color: '#ffffff',
  },

  shareButton: {
    marginLeft: theme.spacing(1),
  }
}));

let fetchingList = false;

export default function AdminScreen() {
  const classes = useStyles();
  const [admdata, setAdmData] = useState({groups:[]});
  
  function fetchList(itemType) {
    let url = apiBaseUrl + "admindata?item=" + itemType;
    axios
      .get(url)
      .then(function (response) {
        try {
          fetchingList = true;
          if (response.data.result) {
            setAdmData(response.data.result);
          }
        } catch (e) {
          console.log(e);
        }
      }).catch(reason => {
        if (reason.response.status === 401) {
          // history.push('/');
        } else {
          alert(reason.response.data.message);
        }
      });
  }
  
  useEffect(() => {
    if (!fetchingList) {
      fetchList('stats');
    } else {
      fetchingList = false;
    }
  });
  

  function Stats() {
    return <><IconButton edge="end"  color="inherit" className={classes.BarChart} onClick={()=>{fetchList('stats')}} >
    <BarChart/>
    </IconButton></>;
  }
  function Sessions() {
    return <><IconButton edge="end"  color="inherit" className={classes.PeopleAlt} onClick={()=>{fetchList('sessions')}} >
    <PeopleAlt />
    </IconButton></>;
  }
  function Users() {
    return <><IconButton edge="end"  color="inherit" className={classes.People} onClick={()=>{fetchList('allusers')}} >
    <People />
    </IconButton></>;
  }
  
  function UnverifiedUsers() {
    return <><IconButton edge="end"  color="inherit" className={classes.PeopleOutline} onClick={()=>{fetchList('unverifiedusers')}} >
    <PeopleOutline />
    </IconButton></>;
  }
  
  function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function formatValue(cellValue) {
    let value = cellValue.value;
    let unit = cellValue.unit ? cellValue.unit : "";
    if (unit === 'count') {
      return (value).toLocaleString('en');
    } else if (unit === 'bytes') {
      return formatBytes(value, 3);
    } else if (unit === 'datetime') {
      return value;
    } else if (unit === 'seconds') {
      let y = ~~(value / (3600*24*365));
      let d = ~~((value / (3600*24)) % 365);
      let h = ~~((value / 3600) % 24);
      let m = ~~((value / 60) % 60);
      let s = (value % 60); // keep fractions
      return (y > 0 ? `${y}y ` : "") + 
            (y > 0 | d > 0 ? `${d}d ` : "") +
            (y > 0 | d > 0 | h > 0 ? `${h}h ` : "") +
            (y > 0 | d > 0 | h > 0 | m > 0 ? `${m}m ` : "") +
            `${s}s`; // always print seconds + fractions

    }
    return value;
  }
  
  return (
    <div>
      <AppBar position="fixed" style={{backgroundColor:"#00bcd4"}}>
        <Toolbar className={classes.topBar}>
          <Typography variant="h5" align="center" className={classes.header}>Admin</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <br />
      <div margin="10" width="80%">
    {admdata.groups.map((group) => (
      <>
      <Typography variant="h6" align="left">{group.heading}</Typography>
    <TableContainer component={Paper} >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead> 
          <TableRow> 
          </TableRow>
        </TableHead> 
    <TableBody> 
    {group.items.map((row) => (
        <TableRow>
          {row.map((cellValue, index) => {
            if (index === 0) {
              return <TableCell component="th" scope="row" align="left">{formatValue(cellValue)}</TableCell>;
            } else {
              return <TableCell component="th" scope="row" align="right">{formatValue(cellValue)}</TableCell>;
            }
          })}
        </TableRow>        
        ))}
        </TableBody>
      </Table>
    </TableContainer>   
    </>
    ))}     
      </div>
      <br />
      <br />
      <br />
      <br />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Link to='/lists'>
            <IconButton edge="start" color="inherit" className={classes.homeButton}>
              <Home />
            </IconButton>
          </Link>
          <Stats />
          <Sessions />
          <Users />
          <UnverifiedUsers />
        </Toolbar>
      </AppBar>
    </div>
  );
}

