# converty

a fast all-purpose natural language conversion tool  

powered by the currency conversion api [here](https://github.com/fawazahmed0/exchange-api)

# usage

examples:
- `10usd to eur` or `10 usd to eur` (spaces are ignored for units)
- `10mm2 to cm2` (powers are just digits after the unit for ease of use)
- `10s to d`

# supported conversions

you can also use the full non-abbreviated version of every unit below

## length

`mm to cm`, `cm to mm`, `cm to m`, `m to cm`, `m to km`, `km to m`, `mm to m`, `m to mm`, `km to mm`, `mm to km`

## area

`mm2 to cm2`, `cm2 to mm2`, `cm2 to m2 `, `m2 to cm2`, `m2 to km2`, `km2 to m2`, `mm2 to m2`, `m2 to mm2`

## time

- s = seconds
- m = minutes
- h = hour
- d = day
- wk = week
- mo = month
- y = year

`s to m`, `m to s`, `m to h`, `hr to m`, `h to d`, `d to h`, `m to h`, `h to m`, `h to d`, `d to h`, `d to w`, `wk to`, `wk to mo`, `mo to wk`, `mo to y`, `y to mo`, `d to y`, `y to d`

## temperature

- f = farenheit
- c = celcius
- k = kelvin

`f to c`, `c to f`, `k to c`, `c to k`, `k to f`, `f to k`

## electrical

- W = watts
- A = amps
- V = voltage

example: `watts to amps at voltage` (calculates amps with given watts and voltage)

`w to a at v`, `w to v at a`, `a to w at v`, `a to v at w`, `v to a at w`, `v to w at a`

## currencies

example: `10 usd to myr`