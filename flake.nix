{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flakelight.url = "github:nix-community/flakelight";
  };
  outputs = { flakelight, ... }@inputs:
    flakelight ./. {
      inherit inputs;
      devShell.packages = pkgs: with pkgs; [ nodejs ];
      package = { buildNpmPackage }:
        buildNpmPackage {
          name = "capstone";
          version = "1.1.0";
          src = ./.;
          npmDepsHash = "sha256-2y+ehYP1XmKpEJPj54geO8V31S1CT9xkywW1x9gfUhc=";
          installPhase = ''
            mkdir $out
            npm run build
            cp -r dist/* $out
          '';
        };
    };
}
