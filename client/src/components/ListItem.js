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
}) {
  const markCompleted = () => checkList(id);
  const clickOnList = () => goToList(id);
  const listStyle = isCompleted
    ? { textDecoration: 'line-through', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    : { textDecoration: 'none', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'  };
  const delList = () => deleteList(id);
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
            </CardContent>
            <IconButton style={{ float: 'right' }} onClick={delList}>
              <Delete style={{ color: 'red' }} />
            </IconButton>
          </Card>
      </Container>
    </div>
  );
}
