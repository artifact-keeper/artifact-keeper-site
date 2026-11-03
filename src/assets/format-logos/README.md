# Format logos

These SVGs are from [Simple Icons](https://simpleicons.org/) and are released under
[CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). The brand
colour recorded in the promo kit manifest (`brand/format-logos/manifest.json`) is applied as
the `fill` attribute. The marks themselves belong to their owners; follow each owner's
guidelines when using them. The landing page inlines them as an SVG sprite, so nothing here
is served as a file: `src/lib/landing-svg.ts` loads every SVG in this folder with
`import.meta.glob(..., { query: '?raw' })`, reads the brand `fill`, and builds `FORMAT_SYMBOLS`,
a hidden `<svg><defs>` with one `<symbol id="i-<slug>">` per slug in `usedSlugs` (the `logo`
slugs of the marquee formats in `src/data/formats.ts`, plus the hero graph's upstream sources;
a missing file fails the build). `src/pages/index.astro` injects `FORMAT_SYMBOLS` once at the top
of the page, and the marquee and hero graph reference the symbols with `<use href="#i-<slug>">`.

| Format | Slug | Icon title | Brand hex | Usage guidelines | Source |
|---|---|---|---|---|---|
| Maven | `apachemaven` | Apache Maven | `#C71A36` | <https://www.apache.org/foundation/marks> | <https://apache.org/logos> |
| npm | `npm` | npm | `#CB3837` | <https://docs.npmjs.com/policies/logos-and-usage> | <https://www.npmjs.com> |
| PyPI | `pypi` | PyPI | `#3775A9` | none published | <https://pypi.org> |
| NuGet | `nuget` | NuGet | `#004880` | none published | <https://github.com/NuGet/Media/blob/89f7c87245e52e8ce91d94c0a47f44c6576e3a0d/Images/MainLogo/Vector/nuget.svg> |
| Cargo | `rust` | Rust | `#000000` | <https://www.rust-lang.org/policies/media-guide> | <https://www.rust-lang.org> |
| Go | `go` | Go | `#00ADD8` | <https://blog.golang.org/go-brand> | <https://blog.golang.org/go-brand> |
| RubyGems | `rubygems` | RubyGems | `#E9573F` | none published | <https://rubygems.org/pages/about> |
| Composer | `composer` | Composer | `#885630` | none published | <https://getcomposer.org> |
| Hex | `elixir` | Elixir | `#8847B9` | <https://elixir-lang.org/trademarks/> | <https://github.com/elixir-lang/elixir-lang.github.com/tree/031746384ee23b9be19298c92a9699c56cc05845/images/logo> |
| Pub | `dart` | Dart | `#0175C2` | none published | <https://github.com/dart-lang/site-shared/tree/18458ff440afd3d06f04e5cb871c4c5eda29c9d5/src/_assets/image/dart/logo> |
| Swift | `swift` | Swift | `#F05138` | <https://developer.apple.com/swift/resources/> | <https://developer.apple.com/swift/resources/> |
| CocoaPods | `cocoapods` | CocoaPods | `#EE3322` | none published | <https://github.com/CocoaPods/shared_resources/tree/3125baf19976bd240c86459645f45b68d2facd10> |
| CRAN | `r` | R | `#276DC3` | none published | <https://www.r-project.org/logo/> |
| sbt | `scala` | Scala | `#DC322F` | none published | <https://www.scala-lang.org> |
| Conda | `anaconda` | Anaconda | `#44A833` | none published | <https://www.anaconda.com> |
| Docker / OCI | `docker` | Docker | `#2496ED` | none published | <https://www.docker.com/company/newsroom/media-resources> |
| Incus | `linuxcontainers` | Linux Containers | `#333333` | none published | <https://github.com/lxc/linuxcontainers.org/blob/29d3299ddf8718099b6de1464570fbbadbaabecb/static/img/containers.svg> |
| Helm | `helm` | Helm | `#0F1689` | none published | <https://helm.sh> |
| Terraform | `terraform` | Terraform | `#844FBA` | <https://www.hashicorp.com/brand> | <https://www.hashicorp.com/brand> |
| Vagrant | `vagrant` | Vagrant | `#1868F2` | <https://www.hashicorp.com/brand> | <https://www.hashicorp.com/brand> |
| Chef | `chef` | Chef | `#F09820` | none published | <https://www.chef.io> |
| Puppet | `puppet` | Puppet | `#FFAE1A` | none published | <https://puppet.com/company/press-room/> |
| Ansible | `ansible` | Ansible | `#EE0000` | none published | <https://www.ansible.com/logos> |
| Debian / APT | `debian` | Debian | `#A81D33` | <https://www.debian.org/logos/> | <https://www.debian.org/logos> |
| RPM / YUM | `redhat` | Red Hat | `#EE0000` | none published | <https://www.redhat.com/en/about/brand/new-brand/details> |
| Alpine / APK | `alpinelinux` | Alpine Linux | `#0D597F` | none published | <https://alpinelinux.org> |
| opkg | `openwrt` | OpenWrt | `#00B5E2` | <https://openwrt.org/docs/guide-graphic-designer/openwrt-logo> | <https://openwrt.org/docs/guide-graphic-designer/openwrt-logo> |
| Conan | `conan` | Conan | `#6699CB` | none published | <https://conan.io> |
| Bazel | `bazel` | Bazel | `#43A047` | none published | <https://bazel.build> |
| Hugging Face | `huggingface` | Hugging Face | `#FFD21E` | <https://huggingface.co/brand> | <https://huggingface.co/brand> |
| JetBrains Plugins | `jetbrains` | JetBrains | `#000000` | <https://www.jetbrains.com/company/brand/> | <https://www.jetbrains.com/company/brand/logos/> |
| Git LFS | `gitlfs` | Git LFS | `#F64935` | none published | <https://git-lfs.github.com> |
| Eclipse p2 | `eclipseide` | Eclipse IDE | `#2C2255` | none published | <https://www.eclipse.org/artwork/> |
