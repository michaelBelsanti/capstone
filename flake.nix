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
          version = "1.0.0";
          src = ./.;
          npmDepsHash = "sha256-YU61KGCOT6wapsmPhZsmaptHX5vaYQyEobBq2ZmCIEw=";
          installPhase = ''
            mkdir $out
            npm run build
            cp -r dist/* $out
          '';
        };
    };
}
