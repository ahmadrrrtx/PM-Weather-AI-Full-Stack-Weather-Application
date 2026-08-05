import * as THREE from "three";

/* ─────────────────────────────────────────────
   Earth shader — day texture + night city lights
   blended by the sun terminator, with a twilight
   band and a subtle ocean specular glint.
   Lighting is computed in gamma space for a
   direct, cinematic look.
   ───────────────────────────────────────────── */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uNormalMap;
  uniform vec3 uSunDir;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 n = normalize(vNormalW);

    // Subtle terrain relief from the normal map
    vec3 nm = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    n = normalize(n + nm * 0.06);

    float ndl = dot(n, uSunDir);

    vec3 dayColor = texture2D(uDayMap, vUv).rgb;
    vec3 nightColor = texture2D(uNightMap, vUv).rgb;

    // Day/night blend across the terminator
    float dayFactor = smoothstep(-0.16, 0.30, ndl);
    vec3 color = mix(nightColor * 1.55, dayColor, dayFactor);

    // Twilight band — deep blue glow hugging the terminator
    float twilight = smoothstep(0.02, 0.26, 1.0 - abs(ndl)) * (1.0 - dayFactor);
    color += vec3(0.26, 0.36, 0.62) * twilight * 0.55;

    // Ocean specular glint
    float spec = pow(max(ndl, 0.0), 14.0) * 0.10;
    color += vec3(1.0, 0.92, 0.78) * spec;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createEarthMaterial(
  dayMap: THREE.Texture,
  nightMap: THREE.Texture,
  normalMap: THREE.Texture,
): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uDayMap: { value: dayMap },
      uNightMap: { value: nightMap },
      uNormalMap: { value: normalMap },
      uSunDir: { value: new THREE.Vector3(1, 0.2, 0.4).normalize() },
      uTime: { value: 0 },
    },
  });
  return material;
}

/* ─────────────────────────────
   Atmosphere — dual fresnel shells:
   inner rim (backside) + outer halo.
   ───────────────────────────── */

const ATMO_VERTEX = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const ATMO_RIM = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormalW))), 2.4);
    gl_FragColor = vec4(uColor * fresnel * uIntensity, 1.0);
  }
`;

const ATMO_HALO = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormalW))), 3.6);
    gl_FragColor = vec4(uColor * fresnel * uIntensity, 1.0);
  }
`;

export function createAtmosphereMaterial(
  kind: "rim" | "halo",
  color = new THREE.Color("#4f9cf7"),
  intensity = 1,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: ATMO_VERTEX,
    fragmentShader: kind === "rim" ? ATMO_RIM : ATMO_HALO,
    uniforms: {
      uColor: { value: color },
      uIntensity: { value: intensity },
    },
    side: kind === "rim" ? THREE.BackSide : THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

/* ─────────────────────────────
   Celestial sprites — sun & moon glow.
   ───────────────────────────── */

export function createGlowMaterial(
  color: THREE.Color,
  inner = new THREE.Color("#fff6dc"),
  power = 2.6,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: color },
      uInner: { value: inner },
      uPower: { value: power },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uInner;
      uniform float uPower;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float glow = pow(smoothstep(1.0, 0.0, d), uPower);
        vec3 col = mix(uColor, uInner, glow * 0.85);
        gl_FragColor = vec4(col * glow * 1.7, glow);
      }
    `,
  });
}

/* ─────────────────────────────
   Marker dot — pulsing radar-style ping.
   ───────────────────────────── */

export function createMarkerMaterial(
  color: THREE.Color,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: color },
      uTime: { value: 0 },
      uSelected: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uSelected;
      varying vec2 vUv;

      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float core = smoothstep(1.0, 0.15, d);

        // Radar ping rings
        float ringPhase = fract(uTime * 0.55 + 0.15);
        float ring = smoothstep(1.0, 0.0, abs(d - ringPhase)) * 0.5 * (1.0 - ringPhase);
        float ring2 = smoothstep(1.0, 0.0, abs(d - fract(ringPhase + 0.5))) * 0.3 * (1.0 - fract(ringPhase + 0.5));

        float alpha = core + ring + ring2 + uSelected * 0.25;
        vec3 col = uColor * (0.75 + 0.25 * sin(uTime * 2.4));
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
