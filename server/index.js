import {
  randCompanyName,
  randFirstName,
  randHex,
  randLastName,
} from "@ngneat/falso";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

const customers = Array(1000)
  .fill(null)
  .map((_, id) => ({
    id,
    firstName: randFirstName(),
    lastName: randLastName(),
    color: randHex(),
    company: randCompanyName(),
  }));

fastify.get("/customers", async function handler(request, reply) {
  const page = request.query.page ? Number.parseInt(request.query.page) : 1;
  const pageSize = request.query.page_size
    ? Number.parseInt(request.query.page_size)
    : 20;
  return customers.slice(page * pageSize, (page + 1) * pageSize);
});

fastify.addHook("preHandler", (req, res, done) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const isPreflight = /options/i.test(req.method);
  if (isPreflight) {
    return res.send();
  }
  done();
});

const { ADDRESS = "localhost", PORT = "3000" } = process.env;
try {
  await fastify.listen({ host: ADDRESS, port: parseInt(PORT, 10) });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
