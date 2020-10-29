import React from 'react';
import ContentEditable from 'react-contenteditable';
import { Container, Card, Typography, IconButton } from '@material-ui/core';
import { Check, Delete, Share } from '@material-ui/icons';

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
    ? { textDecoration: 'line-through' }
    : { textDecoration: 'none' };
  const delList = () => deleteList(id);
  return (
    <div>
      <Container onClick={clickOnList}>
        <Typography variant="h5" component="h2" style={listStyle}>
          <Card variant="contained" style={{ marginTop: 5 }}>
            <IconButton onClick={markCompleted}>
              <Check style={{ color: 'green' }} />
            </IconButton>
            {title}
            <br />
            {subtitle}
            <IconButton style={{ float: 'right' }} onClick={delList}>
              <Delete style={{ color: 'red' }} />
            </IconButton>
          </Card>
        </Typography>
      </Container>
    </div>
  );
}
