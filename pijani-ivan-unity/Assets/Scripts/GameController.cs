using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameController : MonoBehaviour
{
    public static GameController Instance;


    [SerializeField] public CharacterController player;
    [SerializeField] public LevelController levelController;

    public void EndLevel()
    {
        levelController.NextLevel();
        player.ResetPlayer();
    }

    // Start is called before the first frame update
    void Start()
    {
        GameController.Instance = this;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
