import React from 'react';
import { Container, Card, Typography, IconButton } from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';

export default function TobuyItem({
  title,
  checkTobuy,
  id,
  isCompleted,
  deleteTobuy,
}) {
  const markCompleted = () => checkTobuy(id);
  const tobuyItemStyle = isCompleted
    ? { textDecoration: 'line-through' }
    : { textDecoration: 'none' };
  const delTobuy = () => deleteTobuy(id);
  return (
    <div>
      <Container>
        <Typography variant="h5" component="h2" style={tobuyItemStyle}>
          <Card variant="contained" style={{ marginTop: 5 }}>
            <IconButton onClick={markCompleted}>
              <Check style={{ color: 'green' }} />
            </IconButton>
            {title}
            <IconButton style={{ float: 'right' }} onClick={delTobuy}>
              <Delete style={{ color: 'red' }} />
            </IconButton>
          </Card>
        </Typography>
      </Container>
    </div>
  );
}
