using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GunShootSound : MonoBehaviour
{
    [SerializeField] AudioSource audioSource;

    void Start()
    {
        Destroy(gameObject, audioSource.clip.length + 0.1f);
    }
}
