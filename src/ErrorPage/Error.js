function ErrorPage(props) {
  return (
    <section className="text-center">
      <h2>{props.message}</h2>
      <p>{props.data}</p>
    </section>
  );
}

export default ErrorPage;
