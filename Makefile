install:
	npm install && grunt init

test:
	@./node_modules/.bin/mocha -u bdd -r should

.PHONY: test