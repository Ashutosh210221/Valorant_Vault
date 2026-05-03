document.querySelectorAll('.bundle-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    window.location.href = 'pages/builder.html';
  });
});
