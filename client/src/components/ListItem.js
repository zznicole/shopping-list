import React from 'react';
import { Container, Card, CardContent, Typography, IconButton } from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';

export default function ListItem({
  title,
  subtitle,
  checkList,
  id,
  isCompleted,
  deleteList,
  goToList,
  sharing
}) {
  const markCompleted = () => checkList(id);
  const clickOnList = () => goToList(id);
  const listStyle = isCompleted
    ? { textDecoration: 'line-through', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    : { textDecoration: 'none', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'  };
  const delList = () => deleteList(id);

  const confirmDel = () => {
    if (window.confirm('Do you want to delete this list?')) {
     delList();
    }
  }
  
  return (
    <div>
      <Container>
          <Card variant="contained" style={{ marginTop: 5, display: 'flex', alignContent: 'space-between', alignItems: 'stretch' }}>
            <IconButton onClick={markCompleted}>
              <Check style={{ color: 'green' }} />
            </IconButton>
            <CardContent onClick={clickOnList} style={{flex: 1, minWidth: 0}}>
              <Typography variant="h5" component="h2" style={listStyle}>
                {title}
              </Typography>
              <Typography variant="subtitle1" style={listStyle} color="textSecondary">
                {subtitle}
              </Typography>
              <Typography variant="subtitle2" style={listStyle} color="textSecondary" align={"right"}>
                {sharing}
              </Typography>
            </CardContent>
            <IconButton style={{ float: 'right' }} onClick={confirmDel}>
              <Delete style={{ color: 'red' }} />
            </IconButton>
          </Card>
      </Container>
    </div>
  );
}
