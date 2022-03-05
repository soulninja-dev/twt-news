# TWT news

A fun website to post news about what's poppin' in the tech with tim [discord](https://discord.gg/twt)

# Project roadmap

- ~~ship MVP~~
- ~~spam control and better auth~~
- user roles for moderation

# Contributing

All communication happens in the discord server, so ping `@SoulNinja#1717` there to ask about features you want to implement etc.

# Contact

### Developers:

- [SoulNinja](https://github.com/SoulNinja-dev)
- [KrYmZiN](https://github.com/Shiv-Patil)

### Bug hunter:
- [FirePlank](https://github.com/FirePlank)

---

## Running locally

### Environment variables

- Create a `.env` file in the config folder in the root project directory
- Add these key value pairs

```
PORT=[port number of ur wish]
DBURI=[mongo db url]
JWT_SECRET=[some random gibberish]
```

- run `npm ci`
- run `node seeder.js -d`
- run `node seeder.js -i`
- run `npm run dev`
- visit the website running on localhost

## Sample user

You can either register a new user on your local dev setup OR login to this sample user using these credentials

```json
{
	"email": "testuser@test.com",
	"password": "testpassword"
}
```
