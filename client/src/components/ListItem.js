import React from 'react';
import { Container, Card, Typography, IconButton } from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';

export default function ListItem({
  title,
  subtitle,
  checkList,
  id,
  isCompleted,
  deleteList,
}) {
  const markCompleted = () => checkList(id);
  const listStyle = isCompleted
    ? { textDecoration: 'line-through' }
    : { textDecoration: 'none' };
  const delList = () => deleteList(id);
  return (
    <div>
      <Container>
        <Typography variant="h5" component="h2" style={listStyle}>
          <Card variant="contained" style={{ marginTop: 5 }}>
            <IconButton onClick={markCompleted}>
              <Check style={{ color: 'green' }} />
            </IconButton>
            {title}
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
